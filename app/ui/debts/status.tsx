import { Progress } from "antd";

export default function DebtStatus({ status }: { status: number }) {
  return (
    <div className="inline-flex items-center">
      <Progress 
        type="circle" 
        percent={status} 
        format={(status:number) => status === 100 ? "已还清" : `${status}%`}
        width={50}
        strokeWidth={10}
      />
    </div>
  );
}
