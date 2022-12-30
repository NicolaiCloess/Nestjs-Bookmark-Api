import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                user_id: userId
            }
        })
    }

    getBookmarkById(userId: number, 
    bookmarkId: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                user_id: userId
            }
        })
    }

    async createBookmark(userId: number, 
    dto: CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data: {
                user_id: userId,
                ...dto,
            }
        })
        return bookmark;
    }

    async editBookmarksById(userId: number, 
    bookmarkId: number,
    dto: EditBookmarkDto) {
        // get bookmark by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        })

        // check if user is owner of bookmark
        if (!bookmark || bookmark.user_id !== userId) {
            throw new ForbiddenException("Access denied")
        }

        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            }
        })
    }

    async deleteBookmarksById(userId: number, 
    bookmarkId: number) {
        // get bookmark by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        })
        // check if user is owner of bookmark
        if (!bookmark || bookmark.user_id !== userId) {
            throw new ForbiddenException("Access denied")
        }

        await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        })
    }

}
