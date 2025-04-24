"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  Edit,
  Trash,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Tipo para nuestros datos de usuario
interface User {
  idusuario: number
  nombre: string
  apellido: string
  email: string
  usuario: string
  contrasena_hash: string
  contrasena_md5: string
  contrasena_sha1: string
  status: number
}

export default function DataTable() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof User | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Omit<User, "idusuario">>({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    contrasena_hash: "",
    contrasena_md5: "",
    contrasena_sha1: "",
    status: 1,
  })

  const itemsPerPage = 10

  // Obtener datos de la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/usuarios")
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error al obtener los usuarios:", error)
      }
    }

    fetchUsers()
  }, [])

  // Crear usuario
  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:4000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
      if (response.ok) {
        const createdUser = await response.json()
        setUsers((prev) => [...prev, createdUser])
        setIsModalOpen(false)
        setNewUser({
          nombre: "",
          apellido: "",
          email: "",
          usuario: "",
          contrasena_hash: "",
          contrasena_md5: "",
          contrasena_sha1: "",
          status: 1,
        })
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error)
    }
  }

  // Actualizar usuario
  const handleUpdateUser = async () => {
    if (!editingUser) return
    try {
      const response = await fetch(`http://localhost:4000/usuarios/${editingUser.idusuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      })
      if (response.ok) {
        const updatedUser = await response.json()
        setUsers((prev) =>
          prev.map((user) => (user.idusuario === updatedUser.idusuario ? updatedUser : user)),
        )
        setEditingUser(null)
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error)
    }
  }

  // Eliminar usuario
  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/usuarios/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.idusuario !== id))
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error)
    }
  }

  // Filtrar usuarios por término de búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user &&
      user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      user.usuario?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Ordenar usuarios
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginar usuarios
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-2xl">Usuarios</CardTitle>
            <CardDescription>Usuarios encriptados</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Crear Usuario
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.idusuario}>
                      <TableCell>{user.idusuario}</TableCell>
                      <TableCell>{user.nombre}</TableCell>
                      <TableCell>{user.apellido}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.usuario}</TableCell>
                      <TableCell>{user.status === 1 ? "Activo" : "Inactivo"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingUser(user)
                              setIsModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteUser(user.idusuario)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para crear/editar usuario */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre"
                value={editingUser ? editingUser.nombre : newUser.nombre}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, nombre: e.target.value })
                    : setNewUser({ ...newUser, nombre: e.target.value })
                }
              />
              <Input
                placeholder="Apellido"
                value={editingUser ? editingUser.apellido : newUser.apellido}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, apellido: e.target.value })
                    : setNewUser({ ...newUser, apellido: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={editingUser ? editingUser.email : newUser.email}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, email: e.target.value })
                    : setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <Input
                placeholder="Usuario"
                value={editingUser ? editingUser.usuario : newUser.usuario}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, usuario: e.target.value })
                    : setNewUser({ ...newUser, usuario: e.target.value })
                }
              />
              <Input
                placeholder="Contraseña Hash"
                value={editingUser ? editingUser.contrasena_hash : newUser.contrasena_hash}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, contrasena_hash: e.target.value })
                    : setNewUser({ ...newUser, contrasena_hash: e.target.value })
                }
              />
              <Input
                placeholder="Contraseña MD5"
                value={editingUser ? editingUser.contrasena_md5 : newUser.contrasena_md5}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, contrasena_md5: e.target.value })
                    : setNewUser({ ...newUser, contrasena_md5: e.target.value })
                }
              />
              <Input
                placeholder="Contraseña SHA1"
                value={editingUser ? editingUser.contrasena_sha1 : newUser.contrasena_sha1}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, contrasena_sha1: e.target.value })
                    : setNewUser({ ...newUser, contrasena_sha1: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                {editingUser ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}