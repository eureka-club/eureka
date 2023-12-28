"use client"
import ReactQueryProvider from "@/src/providers/ReactQueryProvider"
import CycleDetailHeader from "./component/CycleDetailHeader"
import NextAuthProvider from "@/src/providers/NextAuthProvider"

export default function Layout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {

    return (
      <NextAuthProvider>
        <ReactQueryProvider>
          <section style={{margin:'150px 0'}}>
            {/* Include shared UI here e.g. a header or sidebar */}
            <CycleDetailHeader
              onParticipantsAction={async ()=>{}}
              onCarouselSeeAllAction={async ()=>{}}
            />
      
            {children}
          </section>
        </ReactQueryProvider>
      </NextAuthProvider>
    )
  }