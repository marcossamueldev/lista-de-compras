import { SquarePen } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Task } from "@prisma/client"
import { useState } from "react"
import { editTask } from "@/actions/edit-task"
import { toast } from "sonner"

type TaskProps = {
  task: Task
  handleGetTasks: () => void
}

const EditTask = ({ task, handleGetTasks }: TaskProps) => {
  const [editedTask, setEditedTask] = useState(task.task)

  const handleEditTask = async () => {
    try {
      if (editedTask !== task.task) {
      toast.success('voce pode manda as informaçoes no bd')
    } else {
      toast.error('as informaçoes nao foram alteradas')
      return
    }

    await editTask({
      idTask: task.id,
      newtask: editedTask
    })

    handleGetTasks()
    } catch (error) {
      throw error
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Editar Tarefa"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
          />

          <DialogClose asChild>
            <Button className="cursor-pointer" onClick={handleEditTask}>
              Editar
            </Button>
          </DialogClose>

        </div>

      </DialogContent>
    </Dialog>
  )
}

export default EditTask