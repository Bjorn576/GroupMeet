class InvitesController < ApplicationController

  def create
    iparams = params.require(:invite).permit(:user_email, :group_id)
    @user = User.find_by_email(iparams[:user_email])
    @group = Group.find_by_id(iparams[:group_id])
    @invite = Invite.new

    if @user.invites
      @check = @user.invites.find_by_group_id(@group.id)
      puts "***"
      puts @check
      puts "***"
    end

    if (not @group.users.include? @user) && @check == nil

      @invite.user_id = @user.id
      @invite.group_id = @group.id
      @invite.gname = @group.gname
      if !@invite.save
          respond_to do |format|
            format.json{render json: @invite.errors, status: :unprocessable_entity}
          end
      end
    end

    if @user.id == currentUser.id
      #Respond with you can't invite yourself you dingbat
    end
  end

  def accept
    userid = params[:adduser]
    @group = Group.find(params[:groupid])
    @user = User.find(userid)

    @group = Group.find(params[:groupid])
    #Add user without immediately committing to the database
    @group.association(:users).send(:build_through_record, @user) unless @group.users.include? @user

    if @group.save(validate: false)
      @invite = Invite.find(params[:id])
      @invite.destroy
    end


    #Just in case I need my beautiful ajax again :'(
    #respond_to do |format|
    #  format.json {render json: userArray}
    #end
  end

  def destroy
    @invite = Invite.find(params[:id])
    @invite.destroy
  end
end
