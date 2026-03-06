export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-auto transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Display Interactive - Test Dev Fullstack
        </p>
      </div>
    </footer>
  );
}

export default Footer;
