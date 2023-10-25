import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ProductListSkeleton() {
    return (
        <>
            <div className='border border-gray-200 p-2'>
                <Skeleton className='h-48 lg:h-80'></Skeleton>
                <div className='flex mt-1 justify-between'>
                    <Skeleton width={ 40 }></Skeleton>
                    <Skeleton width={ 40 }></Skeleton>
                </div>
                <div className='flex mt-1 justify-between'>
                    <Skeleton width={ 40 }></Skeleton>
                    <Skeleton width={ 40 }></Skeleton>
                </div>
            </div>
        </>
    )
}