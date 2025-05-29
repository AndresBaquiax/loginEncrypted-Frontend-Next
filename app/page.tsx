import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold">Encriptacion en Hash, MD5, SHA-1 y RSA</h1>
        <p className="text-lg text-gray-600">Diego Andres Baquiax Barrios - 202108036</p>
        <p className="text-lg text-gray-600">Miguel Angel Garcia Sapon - 202108056</p>
        <p className="text-lg text-gray-600">Marco Santiago López Ochoa - 202208027</p>
        <div className="flex flex-col space-y-4">
          <Link href="/login" passHref>
            <Button className="w-full">Iniciar Sesión con HASH</Button>
          </Link>
          <Link href="/md5" passHref>
            <Button className="w-full">Iniciar Sesión con MD5</Button>
          </Link>
          <Link href="/sha1" passHref>
            <Button className="w-full">Iniciar Sesión con SHA-1</Button>
          </Link>
          <Link href="/rsa" passHref>
            <Button className="w-full">Iniciar Sesión con RSA</Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button variant="secondary" className="w-full">
              Ver Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
