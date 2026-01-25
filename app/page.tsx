"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Plus, Trash2, ListCheck, Sigma, LoaderCircle } from 'lucide-react';
import EditTask from "@/components/edit-task"
import { getTasks } from "@/actions/get-tasks-from-bd";
import { useEffect, useState } from "react"
import { Task } from "@prisma/client";
import { NewTask } from "@/actions/add-task";
import { deleteTask } from "@/actions/delete-task";
import { toast } from "sonner"
import { updateTaskStatus } from "@/actions/toggle-done"
import Filter from "@/components/filter"
import { FilterType } from "@/components/filter"
import { deleteCompletedTasks } from "@/actions/clear-completed-tasks"


const Home = () => {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [task, setTask] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [currentFilter, setCurrentFliter] = useState<FilterType>('all')
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])


  const handleGetTasks = async () => {
    try {
      const tasks = await getTasks()
      if (!tasks) return
      setTaskList(tasks)
    } catch (error) {
      throw error
    }
  }

  const handleAddTask = async () => {
    setLoading(true)
    try {
      if (task.length === 0 || !task) {
        toast.error('insira uma atividade')
        setLoading(false)
        return
      }

      const myNewtask = await NewTask(task)

      if (!myNewtask) return

      setTask('')

      await handleGetTasks()
      toast.success("Tarefa adicionada com sucesso!")
    } catch (error) {
      throw error
    }
    setLoading(false)
  }

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) return

      const deletedTask = await deleteTask(id)

      if (!deletedTask) return

      await handleGetTasks()
      toast.warning("Tarefa deletada com sucesso!")
    } catch (error) {
      throw error
    }

  }

  const handleToggleTask = async (taskId: string) => {
    const previousTasks = [...taskList];

    try {
      setTaskList((prev) => {
        const updatedTasks = prev.map((task) => {
          if (task.id === taskId) {
            return { ...task, done: !task.done };
          } else {
            return task;
          }
        });
        return updatedTasks;
      });
      await updateTaskStatus(taskId)
    } catch (error) {
      setTaskList(previousTasks)
      throw error
    }

  };

  const clearCompletedTasks = async () => {
    const deletedTask = await deleteCompletedTasks()

    if(!deletedTask) return

    setTaskList(deletedTask)
  }

  useEffect(() => {
    const fetchTasks = async () => {
      await handleGetTasks()
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    switch (currentFilter) {
      case 'all':
        setFilteredTasks(taskList)
        break
      case 'pending':
        const pedingTasks = taskList.filter(task => !task.done)
        setFilteredTasks(pedingTasks)
        break
      case 'completed':
        const completedTask = taskList.filter(task => task.done)
        setFilteredTasks(completedTask)
    }
  }, [currentFilter, taskList])

  return (
    <main className="w-full h-screen bg-gray-100 flex justify-center items-center">

      <Card className="w-lg p-4">
        <CardHeader>
          <div className="flex gap-2">
            <Input placeholder="Adicionar tarefa" onChange={(e) => setTask(e.target.value)} value={task} />
            <Button variant="default" className="cursor-pointer" onClick={handleAddTask} >
              {loading ? <LoaderCircle className="animate-spin" /> : <Plus />}
              Cadastrar</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Separator className="mb-6" />

          <Filter currentFilter={currentFilter} setCurrentFliter={setCurrentFliter} />


          <div className=" mt-4 border-b">
            {taskList.length === 0 && <p className="text-xs border-1 py-4">Voce nao possui atividade cadastradas.</p>}

            {filteredTasks.map(task => (
              <div className=" h-14 flex justify-between items-center border-b border-t" key={task.id}>
                <div className={`${task.done ? 'w-1 h-full bg-green-400' : 'w-1 h-full bg-red-400'}`}></div>
                <p className="flex-1 px-2 text-sm cursor-pointer hover:text-gray-800"

                  onClick={() => handleToggleTask(task.id)}
                >{task.task}</p>
                <div className="flex items-center gap-2">

                  <EditTask task={task} handleGetTasks={handleGetTasks} />

                  <Trash2 size={16} className="cursor-pointer" onClick={() => handleDeleteTask(task.id)} />
                </div>
              </div>
            ))}

          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center ">
              <ListCheck size={18} />
              <p className="text-xs">Tarefas concluidas ({taskList.filter(task => task.done).length}/{taskList.length})</p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="text-xs h-7 cursor-pointer" variant="outline" >Limpar tarefas concluidas <Trash2 /> </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja excluir x itens?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer" onClick={clearCompletedTasks}>Sim</AlertDialogCancel>
                  <AlertDialogAction className="cursor-pointer" >Cancela</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>

          <div className="h-2 w-full bg-gray-200 mt-4 rounded-md">
            <div className="h-full bg-blue-500 rounded-md" style={{ width: `
              ${((taskList.filter(task => task.done).length) / taskList.length) * 100}%` }}></div>
          </div>

          <div className="flex justify-end items-center mt-4 gap-2">
            <Sigma size={18} />
            <p className="text-xs">{taskList.length} tarefas no total</p>
          </div>

        </CardContent>

      </Card>
    </main>
  )
}

export default Home