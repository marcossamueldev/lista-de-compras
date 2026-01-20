import { prisma } from "@/utils/prisma";

export const getTasks = async () => {
  // .task no singular, porque é o nome do seu 'model Task' no schema
  const tasks = await prisma.task.findMany(); 
  
  return tasks;
};