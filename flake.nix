{
  description = "Alexis's NixOS flake";

  # A flake.nix file is an attribute set with two attributes
  # called `inputs` and `outputs`.

  # The `inputs` attribute lists other flakes you would like to use.
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";

    home-manager = {
      url = "github:nix-community/home-manager/release-23.11";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags.url = "github:Aylur/ags";

    hardware.url = "github:nixos/nixos-hardware";
  };

  # The `outputs` attribute is a function.
  # Nix will fetch all the inputs (flakes) above, load *their* flake.nix files, and
  # then call the `outputs` function below with the results from loading all the
  # flakes above.
  outputs = { self, home-manager, nixpkgs, nixpkgs-unstable, ... } @ inputs: {
    nixosConfigurations = {
      astarion = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";

        # Set all inputs parameters as special arguments for all submodules,
        # so you can directly use all dependencies in inputs in submodules
        specialArgs = {inherit inputs nixpkgs-unstable;};

        modules = [
          ./nixos/configuration.nix

          # TODO: ???
          home-manager.nixosModules.home-manager

          {
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = {inherit inputs nixpkgs-unstable;};
            home-manager.users.alexis = import ./home-manager/home.nix;
          }
        ];
      };
    };
  };
}
