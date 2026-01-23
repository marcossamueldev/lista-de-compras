"use server"
import { prisma } from "@/utils/prisma";

export const deleteTask = async (idtask: string) => {
    try {
        if(!idtask) return

    const deletedTask = await prisma.task.delete({
        where: {
            id: idtask
        }
    })

    if(!deletedTask) return

    return deletedTask

} catch (error) {
        throw error
    }
}