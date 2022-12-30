import { Controller, UseGuards, Get, Post, Patch, Delete, Param, Body, HttpCode } from '@nestjs/common/decorators';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Get() 
    getBookmarks(@GetUser("id") userId: number) {
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(":id")
    getBookmarkById(@GetUser("id") userId: number, 
    @Param("id", ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId)
    }

    @Post()
    createBookmark(@GetUser("id") userId: number, 
    @Body() dto: CreateBookmarkDto){
        return this.bookmarkService.createBookmark(userId, dto)
    }

    @Patch(":id")
    editBookmarksById(@GetUser("id") userId: number, 
    @Param("id", ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto, 
    ) {
        return this.bookmarkService.editBookmarksById(userId, bookmarkId, dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    deleteBookmarksById(@GetUser("id") userId: number, 
    @Param("id", ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookmarksById(userId, bookmarkId)
    }

}
