"use server"

import {prisma} from "@/utils/prisma";

export const NewTask = async (tarefa: string) => {
    try {
        if(!tarefa) return

    const newtask = await prisma.task.create({
        data: {
            task: tarefa,
            done: false
        }
    })

    if(!newtask) return

    return newtask

    } catch (error) {
        throw error
    }
}