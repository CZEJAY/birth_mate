"use client"

import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface ConfirmProps {
    requestId: string;
}

const Confirm = ({ requestId }: ConfirmProps) => {
    const [isLoadingAccept, setIsLoadingAccept] = useState(false)
    const [isLoadingReject, setIsLoadingReject] = useState(false)
    const router = useRouter()
    const handleConfirm = async (status: "rejected" | "accepted") => {
        // setIsLoadingReject(true)
        
        try {
            if(status === "accepted"){
                setIsLoadingAccept(true)
                axios.post(`/api/friends/accept/`,
                    {
                        requestId,
                        status
                    }
                )
                .then(() => {
                    router.refresh()
                })
                .finally(() => {
                    setIsLoadingAccept(false)
                })
                
            }
            else if(status === "rejected"){
                setIsLoadingReject(true)
                axios.post(`/api/friends/accept/`,{
                    requestId,
                    status
                }).then(() => {
                    router.refresh()
                })
                .finally(() => {
                    setIsLoadingReject(false)
                })
            }

        } catch (error) {
            
        }
    }

  return (
    <div className='flex justify-end gap-2'>
        <Button 
            disabled={isLoadingAccept || isLoadingReject}
            onClick={() => handleConfirm("rejected")}
        className='h-8 text-light-1
        transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ' 
        variant={'ghost'}>
            {isLoadingReject ? <Loader2 className="animate-spin" /> : "Cancel"}
        </Button>
        <Button 
        onClick={() => handleConfirm("accepted")}
        disabled={isLoadingReject || isLoadingAccept} 
        className='h-8 transition-all 
        disabled:opacity-50 disabled:cursor-not-allowe
        duration-200 hover:bg-primary-500 hover:text-light-1'>
            {isLoadingAccept ? <Loader2 className="animate-spin" /> : "Confirm"}
        </Button>
    </div>
  )
}

export default Confirm