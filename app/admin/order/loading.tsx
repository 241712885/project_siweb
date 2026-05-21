export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="text-center">

        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"/>

        <p className="mt-4 text-green-600 font-semibold">
          Memuat data pemesanan...
        </p>

      </div>

    </div>
  );
}