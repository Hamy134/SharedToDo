import { WelcomeScreen } from "@/components/welcome-screen";

const DashboardPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <WelcomeScreen
        title={
          <>
            Welcome to <span className="text-primary font-bold">CountWave</span>
          </>
        }
        imgUrl={{
          default: {
            src: "/empty.png",
            alt: "Empty",
          },
          dark: {
            src: "/empty-dark.png",
            alt: "Empty",
          },
        }}
        type="dashboard"
      />
    </div>
  );
};

export default DashboardPage;
