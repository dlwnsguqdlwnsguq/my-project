import Link from 'next/link'
import { Rocket, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Floating astronaut icon */}
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-purple/20 to-primary-blue/20 flex items-center justify-center animate-float">
            <Rocket className="w-16 h-16 text-primary-blue transform rotate-45" />
          </div>
          {/* Stars around */}
          <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="absolute bottom-4 left-0 w-1.5 h-1.5 bg-primary-blue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-8 -left-4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          우주 미아
        </h2>
        <p className="text-stardust-gray text-lg max-w-md mx-auto mb-8">
          이 페이지는 블랙홀에 빨려 들어갔거나,
          <br />
          아직 발견되지 않은 은하에 있는 것 같습니다.
        </p>

        <Link href="/">
          <Button size="lg">
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  )
}
