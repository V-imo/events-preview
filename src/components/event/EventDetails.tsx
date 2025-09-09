"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DEFINITIONS } from "vimo-events"

type PrimitiveType = "string" | "number" | "boolean"

type AttributeDescriptor = {
  name: string
  description?: string
  // Primitive
  type?: PrimitiveType
  // Object
  attributes?: AttributeDescriptor[]
  // Array of primitives or object
  arrayOf?:
    | PrimitiveType
    | { attributes: AttributeDescriptor[] }
    | PrimitiveType[]
  // Enum of literals
  enum?: (string | number)[]
  // Union
  oneOf?: (PrimitiveType | { attributes: AttributeDescriptor[] })[]
}

type EventDefinition = {
  name: string
  camelName?: string
  description?: string
  attributes: AttributeDescriptor[]
}

function describeAttributeType(a: AttributeDescriptor): string {
  if (a.type) return a.type
  if (a.enum) return `enum(${a.enum.map(String).join(" | ")})`
  if (a.attributes) return "object"
  if (a.arrayOf) {
    if (Array.isArray(a.arrayOf)) {
      return `array<${(a.arrayOf as PrimitiveType[]).join(" | ")}>`
    }
    if (typeof a.arrayOf === "string") return `array<${a.arrayOf}>`
    return "array<object>"
  }
  if (a.oneOf) {
    const parts = a.oneOf.map((v) => (typeof v === "string" ? v : "object"))
    return parts.join(" | ")
  }
  return "unknown"
}

function NestedAttributes({
  attributes,
}: {
  attributes: AttributeDescriptor[]
}) {
  return (
    <div className="ml-4 border-l pl-4">
      <AttributesTable attributes={attributes} isNested />
    </div>
  )
}

function AttributesTable({
  attributes,
  isNested = false,
}: {
  attributes: AttributeDescriptor[]
  isNested?: boolean
}) {
  if (!attributes?.length) return null
  return (
    <Table className="table-fixed">
      <colgroup>
        <col className="min-w-[12rem] max-w-[20rem]" />
        <col />
      </colgroup>
      {!isNested && (
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {attributes.map((attr) => {
          const typeLabel = describeAttributeType(attr)
          const hasNested =
            Boolean(attr.attributes) ||
            (typeof attr.arrayOf === "object" &&
              !Array.isArray(attr.arrayOf)) ||
            attr.oneOf?.some((v) => typeof v !== "string")
          return (
            <React.Fragment key={attr.name}>
              <TableRow>
                <TableCell className="truncate">
                  <span className="font-medium">{attr.name}</span>{" "}
                  <span className="text-muted-foreground">{typeLabel}</span>
                </TableCell>
                <TableCell className="whitespace-normal break-words">
                  {attr.description ?? ""}
                </TableCell>
              </TableRow>
              {hasNested && (
                <TableRow>
                  <TableCell colSpan={2} className="p-0">
                    {attr.attributes && (
                      <NestedAttributes attributes={attr.attributes} />
                    )}
                    {typeof attr.arrayOf === "object" &&
                      !Array.isArray(attr.arrayOf) && (
                        <NestedAttributes
                          attributes={attr.arrayOf.attributes}
                        />
                      )}
                    {attr.oneOf && (
                      <div className="ml-4 border-l pl-4 space-y-3">
                        {attr.oneOf.map((v, idx) =>
                          typeof v === "string" ? null : (
                            <div key={idx}>
                              <div className="text-xs text-muted-foreground mb-1">
                                Variant {idx + 1}
                              </div>
                              <AttributesTable
                                attributes={v.attributes}
                                isNested
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function EventDetails({
  event,
}: {
  event: typeof DEFINITIONS[number]
}) {
  if (!event) return null
  const title = event.camelName ?? event.name
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <AttributesTable attributes={event.attributes as AttributeDescriptor[]} />
      </CardContent>
    </Card>
  )
}

export default EventDetails
