'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Gamepad2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

interface LoginPromptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action?: string
}

export default function LoginPrompt({ open, onOpenChange, action = "continue" }: LoginPromptProps) {
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      toast({
        title: "Login Required",
        description: "Please sign in to continue",
        variant: "destructive",
      })
    }
  }, [open, toast])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] glass">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            Login Required
          </DialogTitle>
          <DialogDescription className="text-base">
            You need to sign in to {action}. Create an account or sign in to get started!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => {
              window.location.href = '/login'
            }}
            className="gradient-button text-white w-full"
          >
            Sign In
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/register'
            }}
            variant="outline"
            className="w-full"
          >
            Create Account
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
