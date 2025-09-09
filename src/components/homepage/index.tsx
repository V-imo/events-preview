"use client"

import { DEFINITIONS } from "vimo-events"
import {
  Table,
  TableCaption,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function Homepage() {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const filteredDefinitions = useMemo(
    () =>
      DEFINITIONS.filter(
        (definition) =>
          definition.name.toLowerCase().includes(search.toLowerCase()) ||
          definition.camelName.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  )

  return (
    <div>
      <Input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-50"
      />
      <Table>
        <TableCaption>A list of our events</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Camel Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Nb of Attributes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDefinitions.map((definition) => (
            <TableRow
              key={definition.name}
              className="cursor-pointer"
              onClick={() => router.push(`/${definition.name}`)}
            >
              <TableCell>{definition.name}</TableCell>
              <TableCell>{definition.camelName}</TableCell>
              <TableCell className="truncate min-w-[100px] max-w-[400px]">
                {definition.description}
              </TableCell>
              <TableCell>{definition.attributes.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
