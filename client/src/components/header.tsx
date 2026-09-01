export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-tasks text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <img 
                  className="h-8 w-8 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
                  alt="User avatar" 
                />
                <span className="ml-2 text-gray-700 font-medium">CodeAIFlow user Name</span>
                <i className="fas fa-chevron-down ml-2 text-gray-400 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
