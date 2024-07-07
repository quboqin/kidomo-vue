export interface ITask {
  id: string
  name: string
  description: string
  start_time: number
  duration: number
  is_solved: boolean
  notification_id?: number
  image?: string
  latitude?: number
  longitude?: number
}
