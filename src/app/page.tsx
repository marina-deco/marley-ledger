import Header from '@/components/Header'
import TaskInput from '@/components/TaskInput'
import SpiritConsultation from '@/components/SpiritConsultation'
import GhostArena from '@/components/GhostArena'

export default function Home() {
  return (
    <main className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-deep-purple to-dark-green text-pale-yellow">
      <Header />
      <TaskInput />
      <SpiritConsultation />
      <GhostArena />
    </main>
  )
}
