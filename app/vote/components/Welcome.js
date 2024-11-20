import Image from "next/image"

export default function Welcome({ exitWelcome }) {
    return (<main className="w-screen h-screen flex flex-col items-center justify-center gap-12">
        <Image src={'/logo_vertical.png'} alt="Logo" width={200} height={266} />
        <button
            className="bg-white text-[#69860C] 
                font-bold text-[20px] 
                px-28 py-3
                rounded-full"
            onClick={exitWelcome}
        >
            Start
        </button>
    </main>
    )
}