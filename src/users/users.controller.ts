import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // 1. REGISTER A NEW USER
    // Handles: POST http://localhost:3000/users
    @Post()
    async create(@Body() body: any) {
        return this.usersService.createUser(body.username, body.password, body.role);
    }

    // 2. FETCH ALL USERS
    // Handles: GET http://localhost:3000/users
    @Get()
    async getAllUsers() {
        return this.usersService.getAll();
    }

    // 3. FETCH ONE USER BY ID
    // Handles: GET http://localhost:3000/users/:id
    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }

    // 4. UPDATE USER PROPERTIES
    // Handles: PUT http://localhost:3000/users/:id
    @Put(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { username?: string; password?: string; role?: string }
    ) {
        return this.usersService.updateUser(id, body);
    }

    // 5. DELETE A USER
    // Handles: DELETE http://localhost:3000/users/:id
    @Delete(':id')
    async removeUser(@Param('id', ParseIntPipe) id: number): Promise<{ affectedRows: number }> {
        return this.usersService.deleteUser(id);
    }
}
