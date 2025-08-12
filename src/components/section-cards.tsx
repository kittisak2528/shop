import { IconTrendingDown, IconTrendingUp, IconUserPlus } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
type productType = {
  id: number;
  name: string;
  price: number;
  image: string;
  userId: number;
  createdAt: Date;
};
type userType = {
  id: number;
  firstName: string;
  lastName: string;
};


export function SectionCards({ product, user }: { product: productType[], user: userType[] | null }) {
  return (
    // <div className="*:data-[slot=card]:from-primary/5 *
    // :data-[slot=card]:to-card dark:*:data-[slot=card]
    // :bg-card grid grid-cols-1 gap-4 px-4 *
    // :data-[slot=card]:bg-gradient-to-t *
    // :data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
    //   {product.map((p) => {
    //     // หา user ที่ตรงกับ p.userId
    //     const matchedUser = user?.find(u => u.id === p.userId); // สมมติ userType มี id ด้วย ถ้าไม่มี ต้องเพิ่ม
    //     return (
    //       <div key={p.id}>
    //         <Card className="@container/card">
    //           <div className="flex items-center gap-4 px-4 py-2">
    //             <Image
    //               src={p.image || "/placeholder.jpg"}
    //               alt={p.name}
    //               width={80}
    //               height={80}
    //               className="w-20 h-auto object-contain rounded-md shadow-sm"
    //             />
    //             <div className="flex flex-col">
    //               <CardTitle className="text-base font-semibold line-clamp-1">
    //                 {p.name}
    //               </CardTitle>
    //               <CardDescription className="text-sm text-gray-600">
    //                 ราคา {p.price} บาท
    //               </CardDescription>
    //               <Badge variant="outline" className="mt-2 w-fit">
    //                 <IconUserPlus stroke={2} className="mr-1" />
    //                 {matchedUser
    //                   ? `${matchedUser.firstName} ${matchedUser.lastName}`
    //                   : "Unknown User"}
    //               </Badge>

    //             </div>
    //           </div>
    //           <CardFooter className="flex-col items-start gap-1.5 text-sm">
    //             <p className="font-medium text-center">วันที่เพิ่ม</p>
    //             <p>{new Date(p.createdAt).toLocaleDateString('th-TH', {
    //               day: 'numeric',
    //               month: 'long',
    //               year: 'numeric',
    //             })}</p>
    //           </CardFooter>
    //         </Card>
    //       </div>
    //     )
    //   })}


    // </div >

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {product.map(p => {
        const matchedUser = user?.find(u => u.id === p.userId);

        return (
          <div key={p.id}>
            {/* เวอร์ชันสำหรับมือถือ (col-1) */}
            <Card className="p-4 rounded-xl shadow-sm border bg-white sm:hidden">
              {/* ตัวอย่างแสดงใหญ่เต็มที่ */}
              <div className="flex justify-between">
                <Image
                  src={p.image || "/placeholder.jpg"}
                  alt={p.name}
                  width={160}
                  height={160}
                  className="object-contain rounded-md border"
                />
                <div className="text-center justify-around">
                  <CardTitle className="text-lg font-semibold mt-2">{p.id}</CardTitle>
                  <CardTitle className="text-lg font-semibold mt-2">{p.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    ราคา {p.price} บาท
                  </CardDescription>
                  <CardFooter className="text-xs text-gray-500 flex-col items-start">
                    <Badge variant="outline" className="mt-2 w-fit">
                      <IconUserPlus stroke={2} className="mr-1" size={14} />
                      {matchedUser
                        ? `${matchedUser.firstName} ${matchedUser.lastName}`
                        : "Unknown User"}
                    </Badge>
                    <span className="pt-2 font-medium text-gray-700">วันที่เพิ่มสินค้า</span>
                    <span>
                      วันที่: {new Date(p.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span>
                      เวลา:{" "}
                      {new Date(p.createdAt).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    </span>
                  </CardFooter>
                </div>
              </div>
            </Card>
            {/* เวอร์ชันสำหรับหน้าจอใหญ่ (2,3,4 cols) */}
            <Card className="p-4 rounded-xl shadow-sm border bg-white hidden sm:block ">
              {/* รูป + ชื่อสินค้า + ผู้เพิ่ม */}
              <div className="flex gap-3 items-start">
                <Image
                  src={p.image || "/placeholder.jpg"}
                  alt={p.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain rounded-md border"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold">{p.id+" "}{p.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    ราคา {p.price} บาท
                  </CardDescription>
                </div>
              </div>
              {/* วันที่เพิ่ม */}
              <CardFooter className="text-xs text-gray-500 flex-col items-start">
                <Badge variant="outline" className="mt-2 w-fit">
                  <IconUserPlus stroke={2} className="mr-1" size={14} />
                  {matchedUser
                    ? `${matchedUser.firstName} ${matchedUser.lastName}`
                    : "Unknown User"}
                </Badge>
                <span className="pt-2 font-medium text-gray-700">วันที่เพิ่มสินค้า</span>
                <span>
                  วันที่: {new Date(p.createdAt).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>
                  เวลา:{" "}
                  {new Date(p.createdAt).toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}
                </span>
              </CardFooter>
            </Card>
          </div>
        )
      })}

    </div>




  )
}
