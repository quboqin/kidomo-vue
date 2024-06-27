export interface Task {
  id: number
  title: string
  detail?: string
  image?: string
  completed: boolean
  latitude?: number
  longitude?: number
}
