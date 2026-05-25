// lib/queries.ts
import prisma from './prisma';

export async function getServices() {
  const services = await prisma.service.findMany();
  return services;
}