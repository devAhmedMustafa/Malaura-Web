import ItemsListWithFilters from "./components/ItemsListWithFilters";

export default function ItemsPage() {
    return (
        <main className="l-main">
            {/* Header with Logo and Breadcrumb Navigation */}
            <section className="bg-gray-100 py-6">
                <div className="container mx-auto px-4">
                    {/* Logo */}
                    {/* <div className="flex justify-center mb-4">
                        <img 
                            src="/logo.png" 
                            alt="Malaura Logo" 
                            className=" w-auto object-contain"
                        />
                    </div> */}
                    
                    {/* Breadcrumb Navigation */}
                    <nav className="flex justify-center gap-4 items-center text-sm text-gray-600">
                        <a href="/" className="hover:text-primary transition-colors">
                            <i className="fas fa-home mr-1"></i>
                            Home
                        </a>
                        <span className="mx-2">
                            <i className="fas fa-chevron-right text-xs"></i>
                        </span>
                        <span className="text-dark font-medium">Products</span>
                    </nav>
                </div>
            </section>

            {/* Main Content */}
            <ItemsListWithFilters />
        </main>
    );
}