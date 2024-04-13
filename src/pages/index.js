import UserForm from "@/components/UserForm";

export default function Home() {
  return (
    <UserForm
        setMachineStatus="active"
        room="forest"
        machineId={14}
       />
  );
}
