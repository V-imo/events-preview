import Head from "next/head"
import Link from "next/link"
import { DEFINITIONS } from "vimo-events"
import { Button } from "@/components/ui/button"
import EventDetails from "@/components/event/EventDetails"

export default async function EventPage({
  params,
}: {
  params: { event: string }
}) {
  const p = await params
  const { event: eventName } = await p

  const event = DEFINITIONS.find((event) => event.name === eventName)

  return (
    <div className="container mx-auto max-w-5xl p-4">
      <Head>
        <title>{event?.camelName}</title>
      </Head>
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/">← Back</Link>
        </Button>
      </div>
      <EventDetails event={event as (typeof DEFINITIONS)[number]} />
    </div>
  )
}
