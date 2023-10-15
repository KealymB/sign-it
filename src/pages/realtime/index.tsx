import Head from "next/head";
import Camera from "@/components/handpose/Camera";

export default function RTDetection() {
  return (
    <>
      <Head>
        <title>SignIt | RT Handpose</title>
        <meta name="description" content="Sign language training app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Real <span className="text-[hsl(280,100%,70%)]">Time</span>
          </h1>
          <Camera />
        </div>
      </main>
    </>
  );
}
