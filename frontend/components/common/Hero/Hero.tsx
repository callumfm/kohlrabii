export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="sr-only">Kohlrabii home page</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The world's favourite turnip{" "}
        <span className="font-bold text-primary">Kohlrabii</span>
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  )
}
