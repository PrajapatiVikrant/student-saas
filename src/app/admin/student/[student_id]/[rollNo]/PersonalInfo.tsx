"use client";

type PersonalInfoProps = {
  student: {
    name: string;
    email: string;
    phone: string;
    address: string;
    admissionDate: string;
    gender:string;
    class_name:string;
    batch_name:string;
  };
};

export default function PersonalInfo({ student }: PersonalInfoProps) {
  return (
    <div className="space-y-4 text-gray-700">
      <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Class</p>
          <p>{student.class_name}</p>
        </div>
        <div>
          <p className="font-semibold">Batch</p>
          <p>{student.batch_name}</p>
        </div>
        <div>
          <p className="font-semibold">Name</p>
          <p>{student.name}</p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p>{student.email}</p>
        </div>
        <div>
          <p className="font-semibold">Phone</p>
          <p>{student.phone}</p>
        </div>
        <div>
          <p className="font-semibold">Address</p>
          <p>{student.address}</p>
        </div>
        <div>
          <p className="font-semibold">Admission Date</p>
          <p>{new Date(student.admissionDate).toDateString()}</p>
        </div>
      </div>
    </div>
  );
}
