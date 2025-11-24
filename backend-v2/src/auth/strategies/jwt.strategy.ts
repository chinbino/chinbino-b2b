async validate(payload: any) {
  console.log('JWT Validation - Payload:', payload);
  
  const user = await this.usersService.findById(payload.sub);
  
  if (!user) {
    console.log('User not found for ID:', payload.sub);
    throw new UnauthorizedException('User not found');
  }

  if (user.status !== 'active') {
    console.log('User not active:', user.id, user.status);
    throw new UnauthorizedException('User account is not active');
  }

  console.log('JWT Validation - Success for user:', user.id);
  
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
