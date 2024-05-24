{
  description = "Alexis's NixOS configuration";

  # A flake.nix file is an attribute set with two attributes
  # called `inputs` and `outputs`.

  # The `inputs` attribute lists other flakes you would like to use.
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    
    nixpkgs-stable.url = "github:nixos/nixpkgs/nixos-23.11";

    home-manager = {
      url = "github:nix-community/home-manager/release-24.05";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags.url = "github:Aylur/ags";

    hardware.url = "github:nixos/nixos-hardware";

    musnix = { url = "github:musnix/musnix"; };
  };

  # The `outputs` attribute is a function.
  # Nix will fetch all the inputs (flakes) above, load *their* flake.nix files, and
  # then call the `outputs` function below with the results from loading all the
  # flakes above.
  outputs = { home-manager, nixpkgs, ... } @ inputs: {
    nixosConfigurations = {
      astarion = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";

        # Set all inputs parameters as special arguments for all submodules,
        # so you can directly use all dependencies in inputs in submodules
        specialArgs = {inherit inputs;};

        modules = [
          ./nixos/configuration.nix

          inputs.musnix.nixosModules.musnix
        
          home-manager.nixosModules.home-manager

          {
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = {inherit inputs;};
            home-manager.users.alexis = import ./home/home.nix;
          }
        ];
      };
    };
  };
}
