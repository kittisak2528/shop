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
};
type userType = {
  id: number;
  firstName: string;
  lastName: string;
};
export function SectionCards({ product, user }: { product: productType[], user: userType[] | null }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *
    :data-[slot=card]:to-card dark:*:data-[slot=card]
    :bg-card grid grid-cols-1 gap-4 px-4 *
    :data-[slot=card]:bg-gradient-to-t *
    :data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {product.map((p) => {
        // หา user ที่ตรงกับ p.userId
        const matchedUser = user?.find(u => u.id === p.userId); // สมมติ userType มี id ด้วย ถ้าไม่มี ต้องเพิ่ม
        return (
          <div key={p.id}>
            <Card className="@container/card">
              <div className="">
                <CardHeader>
                  <Image
                    src={p.image} // ใช้ placeholder ถ้าไม่มี image
                    width={100}
                    height={100}
                    alt={p.name}
                    className="rounded-md"
                    priority
                  />
                  <div className="">
                    <CardAction>
                      <Badge variant="outline">
                        <IconUserPlus stroke={2} />
                        {matchedUser ? `${matchedUser.firstName} ${matchedUser.lastName}` : 'Unknown User'}
                      </Badge>
                    </CardAction>
                    <div>
                      <CardTitle className="font-semibold tabular-nums @[250px]/card:text-3xl">
                        {p.name}
                      </CardTitle>
                      <CardDescription>ราคา {p.price} บาท</CardDescription>
                    </div>
                  </div>

                </CardHeader>
              </div>
              {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Trending up this month <IconTrendingUp className="size-4" />
                </div>
              </CardFooter> */}
            </Card>
          </div>
        )
      })}


    </div >
  )
}
