import { BookSearch } from 'lucide-react'

function Resources() {
  return (
    <>
      <section className="min-h-[80.8vh]">
        <div className="text-center pt-[5em] flex justify-center ">
          <div>
            <div className="text-red-500 ml-[7em] bg-slate-200 p-4 rounded-full w-fit">
              <BookSearch size={40} />
            </div>
            <h1 className="text-3xl text-red-700">No Resources Found</h1>
          </div>
        </div>
      </section>
    </>
  );
}

export default Resources;