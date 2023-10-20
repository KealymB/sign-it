import Head from "next/head";

export default function Converter() {
  return (
    <>
      <Head>
        <title>SignIt | Converted</title>
        <meta name="description" content="Sign language training app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Video <span className="text-[hsl(280,100%,70%)]">Converter</span>
          </h1>
          <p className="text-white">Coming soon</p>
        </div>
      </main>
    </>
  );
}
