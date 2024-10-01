
import React from 'react'


function Footer() {
  return (
    <footer className='py-10 border-t border-white/15'>
        <div className='container'>
           <div className='flex justify-between items-center'>
                    <div>
                        <h1 className="text-4xl sm:text-4xl md:text-5xl text-center font-bold md:tracking-tighter relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">DynaPrice</h1>
                    </div>

                    <div>
                    <span className="sm:hidden- md:hidden-none md:text-sm text-gray-500 md:text-center dark:text-gray-400">© {" "} 2024 
                        <a href="#" className="hover:underline">{" "}DynaPrice™</a>. All Rights Reserved.</span>
                    </div>
           </div>
        </div>
    </footer>
  )
}

export default Footer
