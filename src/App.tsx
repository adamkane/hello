export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <h1 className="text-6xl font-bold text-white">Hello World!!</h1>
      <div className="relative mt-8" style={{ fontSize: '72pt' }}>
        <span
          className="absolute right-full top-0 mr-8"
          role="img"
          aria-label="otter"
        >
          🦦
        </span>
        <span role="img" aria-label="chicken">
          🐔
        </span>
        <span
          className="absolute left-full top-0 ml-8"
          role="img"
          aria-label="duck"
        >
          🦆
        </span>
      </div>
    </div>
  )
}
