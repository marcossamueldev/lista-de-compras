import { Check, List, ListX } from "lucide-react"
import { Badge } from "./ui/badge"

export type FilterType = 'all' | 'pending' | 'completed'

type FilterProps = {
    currentFilter:  FilterType
    setCurrentFliter: React.Dispatch<React.SetStateAction<FilterType>>
}

const Filter = ({currentFilter, setCurrentFliter }:FilterProps) => {

    return (
        <div className="flex gap-2">
            <Badge 
            className="cursor-pointer" 
            variant={`${currentFilter === 'all' ? "default" : "outline"}`}
            onClick={() => setCurrentFliter('all')}
            ><List /> Todas</Badge>
            <Badge 
            className="cursor-pointer" 
            variant={`${currentFilter === 'pending' ? "default" : "outline"}`}
            onClick={() => setCurrentFliter('pending')}
            ><ListX /> Nao Finalizadas</Badge>
            <Badge 
            className="cursor-pointer" 
            variant={`${currentFilter === 'completed' ? "default" : "outline"}`}
            onClick={() => setCurrentFliter('completed')}
            ><Check /> Concluidas</Badge>
          </div>
    )
}

export default Filter