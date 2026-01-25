"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Plus, Trash2, ListCheck, Sigma, LoaderCircle } from 'lucide-react';
import EditTask from "@/components/edit-task"
import { getTasks } from "@/actions/get-tasks-from-bd";
import { useEffect, useState, useMemo } from "react"
import { Task } from "@prisma/client";
import { NewTask } from "@/actions/add-task";
import { deleteTask } from "@/actions/delete-task";
import { toast } from "sonner"
import { updateTaskStatus } from "@/actions/toggle-done"
import Filter, { FilterType } from "@/components/filter"
import { deleteCompletedTasks } from "@/actions/clear-completed-tasks"

const Home = () => {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [task, setTask] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [currentFilter, setCurrentFliter] = useState<FilterType>('all')

  const filteredTasks = useMemo(() => {
    switch (currentFilter) {
      case 'pending': return taskList.filter(t => !t.done)
      case 'completed': return taskList.filter(t => t.done)
      default: return taskList
    }
  }, [taskList, currentFilter])

  const totalTasks = taskList.length
  const completedTasks = taskList.filter(t => t.done).length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const handleGetTasks = async () => {
    try {
      const tasks = await getTasks()
      if (tasks) setTaskList(tasks)
    } catch (error) {
      console.error(error) // SOLUÇÃO 1: Logamos o erro para o ESLint parar de reclamar
      toast.error("Erro ao carregar tarefas")
    }
  }

  const handleAddTask = async () => {
    if (!task.trim()) {
      toast.error('Insira uma atividade')
      return
    }

    setLoading(true)
    try {
      const myNewtask = await NewTask(task)
      if (myNewtask) {
        setTask('')
        await handleGetTasks()
        toast.success("Tarefa adicionada!")
      }
    } catch (error) {
      console.error(error) // SOLUÇÃO 1
      toast.error("Erro ao criar tarefa")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      await handleGetTasks()
      toast.warning("Tarefa deletada!")
    } catch (error) {
      console.error(error) // SOLUÇÃO 1
      toast.error("Erro ao deletar")
    }
  }

  const handleToggleTask = async (taskId: string) => {
    const previousTasks = [...taskList];
    setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t));

    try {
      await updateTaskStatus(taskId)
    } catch (error) {
      console.error(error) // SOLUÇÃO 1
      setTaskList(previousTasks)
      toast.error("Erro ao atualizar status")
    }
  };

  const clearCompletedTasks = async () => {
    try {
      const updatedList = await deleteCompletedTasks()
      if (updatedList) {
        setTaskList(updatedList)
        toast.success("Tarefas concluídas limpas!")
      }
    } catch (error) {
       console.error(error) // SOLUÇÃO 1
       await handleGetTasks()
    }
  }

  useEffect(() => {
    handleGetTasks()
  }, [])

  return (
    <main className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <Card className="w-lg p-4">
        <CardHeader>
          <div className="flex gap-2">
            <Input 
                placeholder="Adicionar tarefa" 
                onChange={(e) => setTask(e.target.value)} 
                value={task} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button variant="default" className="cursor-pointer" onClick={handleAddTask} disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : <Plus />}
              Cadastrar
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Separator className="mb-6" />
          <Filter currentFilter={currentFilter} setCurrentFliter={setCurrentFliter} />

          <div className="mt-4 border-b">
            {/* SOLUÇÃO 2: Trocamos 'border-1' por 'border' aqui embaixo */}
            {taskList.length === 0 && <p className="text-xs border py-4 text-center text-gray-500">Você não possui atividades cadastradas.</p>}

            {filteredTasks.map(task => (
              <div className="h-14 flex justify-between items-center border-b border-t group" key={task.id}>
                <div className={`${task.done ? 'w-1 h-full bg-green-400' : 'w-1 h-full bg-red-400'}`}></div>
                <p 
                    className={`flex-1 px-2 text-sm cursor-pointer hover:font-bold transition-all ${task.done ? 'line-through text-gray-400' : ''}`}
                    onClick={() => handleToggleTask(task.id)}
                >
                    {task.task}
                </p>
                <div className="flex items-center gap-2 pr-2">
                  <EditTask task={task} handleGetTasks={handleGetTasks} />
                  <Trash2 size={16} className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => handleDeleteTask(task.id)} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center">
              <ListCheck size={18} />
              <p className="text-xs">Tarefas concluídas ({completedTasks}/{totalTasks})</p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                    className="text-xs h-7 cursor-pointer" 
                    variant="outline" 
                    disabled={completedTasks === 0} 
                >
                    Limpar concluídas <Trash2 className="ml-1" size={14}/> 
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir {completedTasks} itens concluídos?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel> 
                  <AlertDialogAction onClick={clearCompletedTasks} className="bg-red-500 hover:bg-red-600">
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="h-2 w-full bg-gray-200 mt-4 rounded-md overflow-hidden">
            <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex justify-end items-center mt-4 gap-2">
            <Sigma size={18} />
            <p className="text-xs">{totalTasks} tarefas no total</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default Home