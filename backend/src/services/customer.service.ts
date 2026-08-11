import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';
import { CreateCustomerRequest, UpdateCustomerRequest } from '../schemas/customer.schema';

export async function getCustomers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  type?: string
) {
  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { mobile: { contains: search } },
      { businessName: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (type) {
    where.customerType = type;
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    customers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCustomerById(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer || customer.isDeleted) {
    throw new ApiError(404, 'Customer not found');
  }

  return customer;
}

export async function createCustomer(data: CreateCustomerRequest) {
  // Check for duplicate email
  const existingCustomer = await prisma.customer.findFirst({
    where: { email: data.email, isDeleted: false },
  });

  if (existingCustomer) {
    throw new ApiError(409, 'Customer with this email already exists');
  }

  const customer = await prisma.customer.create({
    data: {
      ...data,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
    },
  });

  return customer;
}

export async function updateCustomer(id: string, data: UpdateCustomerRequest) {
  const customer = await getCustomerById(id);

  // If email is being changed, check for duplicates
  if (data.email && data.email !== customer.email) {
    const existingCustomer = await prisma.customer.findFirst({
      where: { email: data.email, isDeleted: false },
    });

    if (existingCustomer) {
      throw new ApiError(409, 'Customer with this email already exists');
    }
  }

  const updated = await prisma.customer.update({
    where: { id },
    data: {
      ...data,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : data.followUpDate,
    },
  });

  return updated;
}

export async function deleteCustomer(id: string) {
  await getCustomerById(id);

  const deleted = await prisma.customer.update({
    where: { id },
    data: { isDeleted: true },
  });

  return deleted;
}

export async function getCustomerNotes(customerId: string, page: number = 1, limit: number = 10) {
  // Verify customer exists
  await getCustomerById(customerId);

  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    prisma.customerNote.findMany({
      where: { customerId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.customerNote.count({ where: { customerId } }),
  ]);

  return {
    notes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function createCustomerNote(customerId: string, noteText: string, userId: string) {
  // Verify customer exists
  await getCustomerById(customerId);

  const note = await prisma.customerNote.create({
    data: {
      customerId,
      noteText,
      createdById: userId,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return note;
}

export async function getCustomerNote(customerId: string, noteId: string) {
  // Verify customer exists
  await getCustomerById(customerId);

  const note = await prisma.customerNote.findUnique({
    where: { id: noteId },
  });

  if (!note || note.customerId !== customerId) {
    throw new ApiError(404, 'Note not found');
  }

  return note;
}

export async function updateCustomerNote(customerId: string, noteId: string, noteText: string) {
  await getCustomerNote(customerId, noteId);

  const updated = await prisma.customerNote.update({
    where: { id: noteId },
    data: { noteText },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updated;
}

export async function deleteCustomerNote(customerId: string, noteId: string, userId: string, userRole: string) {
  const note = await getCustomerNote(customerId, noteId);

  if (userRole !== 'ADMIN' && note.createdById !== userId) {
    throw new ApiError(403, 'You can only delete your own notes');
  }

  await prisma.customerNote.delete({
    where: { id: noteId },
  });
}
