import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function AdminProductListSkeleton() {
    return (
        <div>
            <div className='border border-gray-200 p-2'>
                <Skeleton className='h-48 sm:h-44 lg:h-80'></Skeleton>
                <div className='flex mt-2 justify-between'>
                    <Skeleton width={ 40 }></Skeleton>
                    <Skeleton width={ 40 }></Skeleton>
                </div>
                <div className='flex mt-1 justify-between'>
                    <Skeleton width={ 40 }></Skeleton>
                    <Skeleton width={ 40 }></Skeleton>
                </div>
            </div>
            <div className='flex justify-between'>
                <Skeleton width={ 50 } height={ 40 } ></Skeleton>
                <Skeleton width={ 70 } height={ 40 }></Skeleton>
            </div>
        </div>
    )
}