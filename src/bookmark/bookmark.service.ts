import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });

    if (bookmarks.length == 0) {
      return {
        message: 'no Book mark Found',
      };
    }

    return bookmarks;
  }

  async createBookmark(userId: number, bookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...bookmarkDto,
      },
    });

    return {
      message: 'Bookmark Created!',
      bookmark,
    };
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    //   const bookmark = await this.prisma.bookmark.update()
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    bookmarkDto: EditBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource Denied!');
    }

    return await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...bookmarkDto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource Denied!');
    }

    await this.prisma.bookmark
      .delete({
        where: {
          id: bookmarkId,
        },
      })
      .then(() => {
        return {
          message: 'Bookmark Deleted!',
        };
      });
  }
}
