import logo from "../../../public/logo.png";

/**
 * The Header-component for the main screen.
 * Displays buttons within a list centered in the header-bar.
 *
 * @returns {JSX.Element} Header bar with according buttons.
 */

export default function Header() {
  return (
    <>
      <div className="w-full h-20 bg-primary border-primary_border border border-b-2 border-r-2 border-t-0 border-l-0 relative flex items-center shadow-md z-10">
        <img className="pl-3" src={logo} />
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-10 items-center">
          <a
            href=""
            className="block py-2 px-3 text-gray-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white hover:text-blue-600"
          >
            1
          </a>
          <a
            href=""
            className="block py-2 px-3 text-gray-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white hover:text-blue-600"
          >
            2
          </a>
        </div>
      </div>
    </>
  );
}
