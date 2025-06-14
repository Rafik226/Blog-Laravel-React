import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();
    
    // Vérifier si l'utilisateur existe pour éviter les erreurs
    if (!user) {
        return null;
    }

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {/* Utilisez une condition pour vérifier si l'avatar existe */}
                {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            </div>
        </>
    );
}