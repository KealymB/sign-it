import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>SignIt | Home</title>
        <meta name="description" content="Sign language training app" />
        <meta name="theme-color" content="#2e026d" />
        <meta name="msapplication-navbutton-color" content="#2e026d" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#2e026d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Sign <span className="text-[hsl(280,100%,70%)]">It</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-lg bg-white/10 p-4 text-white hover:bg-white/20"
              href="/realtime"
            >
              <h3 className="text-2xl font-bold">Real time detection →</h3>
              <div className="text-lg">Track and record hand pose using AI</div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-lg bg-white/10 p-4 text-white hover:bg-white/20"
              href="/converter"
            >
              <h3 className="text-2xl font-bold">Video to data →</h3>
              <div className="text-lg">
                Convert mp4 video to a structured log of hand poses
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
