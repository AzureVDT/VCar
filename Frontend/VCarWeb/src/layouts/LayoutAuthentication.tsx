import LanguageSelector from "../components/LanguageSelector";

const LayoutAuthentication = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="fixed right-2"><LanguageSelector /></div>
            <div className="flex items-center justify-center w-full h-screen bg-strock">
                {children}
            </div>
        </>
    );
};

export default LayoutAuthentication;