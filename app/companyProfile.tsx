export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans px-10 py-10">
      
      {/* Navbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/LogoPaketinAja.jpeg" 
            alt="logo" 
            className="w-12 h-12 rounded-full object-contain"
          />
          <span className="text-green-700 font-bold text-xl">
            PaketinAja
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-10">
        {/* Left Section */}
        <div>

          <h1 className="text-5xl md:text-6xl font-bold text-emerald-950 mb-4 leading-tight">
            Kirim Paket <span className="text-green-600">Lebih Mudah</span><br />
            Bareng <span className="text-green-600">PaketinAja</span><br />
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-md">
            PaketinAja hadir sebagai solusi pengiriman cepat, aman, dan terpercaya untuk kebutuhan sehari-hari Anda.
          </p>

          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
              Sign In
            </button>
          </div>

          {/* Statistics */}
          <div className="flex gap-10 mt-8">
            <div>
              <h3 className="text-2xl font-bold">50K+</h3>
              <p className="text-base text-gray-500">Paket Terkirim</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">99%</h3>
              <p className="text-base text-gray-500">Tepat Waktu</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">4.9</h3>
              <p className="text-base text-gray-500">Rating</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <img 
            src="/kurirfoto.jpeg" 
            alt="courier" 
            className="w-full max-w-[350px] md:max-w-[450px] lg:max-w-[600px] h-auto" 
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t mt-16 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-600 gap-6">
        <div>
          <h4 className="text-lg md:text-xl font-semibold text-green-700 mb-3">
            Tentang Kami
          </h4>
          <p className="text-base md:text-lg text-gray-600 max-w-md">
            PaketinAja adalah layanan pengiriman praktis, cepat, dan terpercaya dengan fitur jemput paket dan pelacakan resi yang mudah.
          </p>
        </div>

        <div>
          <h4 className="text-lg md:text-xl font-semibold text-green-700 mb-3">
            Kontak
          </h4>

          <a 
            href="https://share.google/C9gNrV8OT3gkb9MTp"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base md:text-lg text-gray-600 hover:underline"
          >
            Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta          
          </a>
          <a 
            href="https://wa.me/6285290002222"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base md:text-lg text-gray-600 hover:underline mt-1"
          >
            +62 852-9000-2222
          </a>
        </div>
      </div>

    </div>
  );
}